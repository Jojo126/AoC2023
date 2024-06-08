const fs = require('node:fs/promises');

async function example() {
    try {
        const input = await fs.readFile('./example_input.txt', { encoding: 'utf8' });
        const hailstones = input.split('\r\n').map(hailstone => {
            const [pos, vel] = hailstone.split('@');
            const posCoords = pos.split(',');
            const velCoords = vel.split(',');
            return {
                position: {
                    x: Number.parseInt(posCoords[0]),
                    y: Number.parseInt(posCoords[1]),
                    z: Number.parseInt(posCoords[2]),
                },
                velocity: {
                    x: Number.parseInt(velCoords[0]),
                    y: Number.parseInt(velCoords[1]),
                    z: Number.parseInt(velCoords[2]),
                },
            };
        });
        //console.log(hailstones);

        /*
        This part was definitely way to difficult for me. I managed to get the first equations system, 
        but did not know how to solve it. Therefore, I had to basically follow the solution reddit user 
        Boojum posted in the AoC forum. They used Cramer's rule to solve the system.

        The steps taken to even get to the point where Cramer's rule can be applied is described below:

        The trajectory of the rock that we throw can be described as:
        x = p_xr + t*v_xr
        y = p_yr + t*v_yr
        z = p_zr + t*v_zr
        where t >= 0

        The hailstones can be described in a similar way:
        Hailstone N:
        x = p_xhN + t*v_xhN
        y = p_yhN + t*v_yhN
        z = p_zhN + t*v_zhN
        where t >= 0

        We know that our rock will collide with each hailstone at some t with the same trajectories described above. 
        We can describe the point of collision between the rock and hailstone N with t_c giving:
        Rock:
        x = p_xr + t_cN*v_xr
        y = p_yr + t_cN*v_yr
        z = p_zr + t_cN*v_zr

        Hailstone N:
        x = p_xhN + t_cN*v_xhN
        y = p_yhN + t_cN*v_yhN
        z = p_zhN + t_cN*v_zhN

        We also know that the hailstone and rock will be at the same position (x,y,z) when they collide resulting in 
        the equations system:
        x = p_xr + t_cN*v_xr = p_xhN + t_cN*v_xhN
        y = p_yr + t_cN*v_yr = p_yhN + t_cN*v_yhN
        z = p_zr + t_cN*v_zr = p_zhN + t_cN*v_zhN
        <=>
        t_cN = (p_xhN - p_xr) / (v_xr - v_xhN)
        t_cN = (p_yhN - p_yr) / (v_yr - v_yhN)
        t_cN = (p_zhN - p_zr) / (v_zr - v_zhN)

        This means that t_cN can be completely ignored by replacing it with one of the three equations in the other two:
        (p_xhN - p_xr) / (v_xr - v_xhN) = (p_yhN - p_yr) / (v_yr - v_yhN) = t_cN
        (p_xhN - p_xr) / (v_xr - v_xhN) = (p_zhN - p_zr) / (v_zr - v_zhN) = t_cN
        <=>
        (p_xhN - p_xr) * (v_yr - v_yhN) = (p_yhN - p_yr) * (v_xr - v_xhN)
        (p_xhN - p_xr) * (v_zr - v_zhN) = (p_zhN - p_zr) * (v_xr - v_xhN)
        <=>
        p_xhN*v_yr - p_xhN*v_yhN - p_xr*v_yr + p_xr*v_yhN = p_yhN*v_xr - p_yhN*v_xhN - p_yr*v_xr + p_yr*v_xhN
        p_xhN*v_zr - p_xhN*v_zhN - p_xr*v_zr + p_xr*v_zhN = p_zhN*v_xr - p_zhN*v_xhN - p_zr*v_xr + p_zr*v_xhN
        <=>
        p_xhN*v_yr - p_xhN*v_yhN - p_xr*v_yr + p_xr*v_yhN - p_yhN*v_xr + p_yhN*v_xhN + p_yr*v_xr - p_yr*v_xhN = 0
        p_xhN*v_zr - p_xhN*v_zhN - p_xr*v_zr + p_xr*v_zhN - p_zhN*v_xr + p_zhN*v_xhN + p_zr*v_xr - p_zr*v_xhN = 0

        Can now easily use e.g. hailstones A & B to easily remove rock unknowns multipled with other rock unknowns from the system:
        Hailstone A:
        p_xhA*v_yr - p_xhA*v_yhA - p_xr*v_yr + p_xr*v_yhA - p_yhA*v_xr + p_yhA*v_xhA + p_yr*v_xr - p_yr*v_xhA = 0
        p_xhA*v_zr - p_xhA*v_zhA - p_xr*v_zr + p_xr*v_zhA - p_zhA*v_xr + p_zhA*v_xhA + p_zr*v_xr - p_zr*v_xhA = 0
        Hailstone B:
        p_xhB*v_yr - p_xhB*v_yhB - p_xr*v_yr + p_xr*v_yhB - p_yhB*v_xr + p_yhB*v_xhB + p_yr*v_xr - p_yr*v_xhB = 0
        p_xhB*v_zr - p_xhB*v_zhB - p_xr*v_zr + p_xr*v_zhB - p_zhB*v_xr + p_zhB*v_xhB + p_zr*v_xr - p_zr*v_xhB = 0

        This gives:
        p_xhA*v_yr - p_xhA*v_yhA - p_xr*v_yr + p_xr*v_yhA - p_yhA*v_xr + p_yhA*v_xhA + p_yr*v_xr - p_yr*v_xhA = p_xhB*v_yr - p_xhB*v_yhB - p_xr*v_yr + p_xr*v_yhB - p_yhB*v_xr + p_yhB*v_xhB + p_yr*v_xr - p_yr*v_xhB
        p_xhA*v_zr - p_xhA*v_zhA - p_xr*v_zr + p_xr*v_zhA - p_zhA*v_xr + p_zhA*v_xhA + p_zr*v_xr - p_zr*v_xhA = p_xhB*v_zr - p_xhB*v_zhB - p_xr*v_zr + p_xr*v_zhB - p_zhB*v_xr + p_zhB*v_xhB + p_zr*v_xr - p_zr*v_xhB
        <=>
        p_xhA*v_yr - p_xhA*v_yhA + p_xr*v_yhA - p_yhA*v_xr + p_yhA*v_xhA - p_yr*v_xhA = p_xhB*v_yr - p_xhB*v_yhB + p_xr*v_yhB - p_yhB*v_xr + p_yhB*v_xhB - p_yr*v_xhB
        p_xhA*v_zr - p_xhA*v_zhA + p_xr*v_zhA - p_zhA*v_xr + p_zhA*v_xhA - p_zr*v_xhA = p_xhB*v_zr - p_xhB*v_zhB + p_xr*v_zhB - p_zhB*v_xr + p_zhB*v_xhB - p_zr*v_xhB
        <=>
        p_xr*(v_yhA-v_yhB) + p_yr*(v_xhB-v_xhA) + v_xr*(p_yhB-p_yhA) + v_yr*(p_xhA-p_xhB) = p_xhA*v_yhA - p_xhB*v_yhB + p_yhB*v_xhB - p_yhA*v_xhA
        p_xr*(v_zhA-v_zhB) + p_zr*(v_xhB-v_xhA) + v_xr*(p_zhB-p_zhA) + v_zr*(p_xhA-p_xhB) = p_xhA*v_zhA - p_xhB*v_zhB + p_zhB*v_xhB - p_zhA*v_xhA

        Will need to use 4 hailstones to get a big enough equation system to solve it with Cramer's rule:
        Hailstones 1 & 2:
        p_xr*(v_yh1-v_yh2) + p_yr*(v_xh2-v_xh1) + v_xr*(p_yh2-p_yh1) + v_yr*(p_xh1-p_xh2) = p_xh1*v_yh1 - p_xh2*v_yh2 + p_yh2*v_xh2 - p_yh1*v_xh1
        p_xr*(v_zh1-v_zh2) + p_zr*(v_xh2-v_xh1) + v_xr*(p_zh2-p_zh1) + v_zr*(p_xh1-p_xh2) = p_xh1*v_zh1 - p_xh2*v_zh2 + p_zh2*v_xh2 - p_zh1*v_xh1
        Hailstones 2 & 3:
        p_xr*(v_yh2-v_yh3) + p_yr*(v_xh3-v_xh2) + v_xr*(p_yh3-p_yh2) + v_yr*(p_xh2-p_xh3) = p_xh2*v_yh2 - p_xh3*v_yh3 + p_yh3*v_xh3 - p_yh2*v_xh2
        p_xr*(v_zh2-v_zh3) + p_zr*(v_xh3-v_xh2) + v_xr*(p_zh3-p_zh2) + v_zr*(p_xh2-p_xh3) = p_xh2*v_zh2 - p_xh3*v_zh3 + p_zh3*v_xh3 - p_zh2*v_xh2
        Hailstones 3 & 4:
        p_xr*(v_yh3-v_yh4) + p_yr*(v_xh4-v_xh3) + v_xr*(p_yh4-p_yh3) + v_yr*(p_xh3-p_xh4) = p_xh3*v_yh3 - p_xh4*v_yh4 + p_yh4*v_xh4 - p_yh3*v_xh3
        p_xr*(v_zh3-v_zh4) + p_zr*(v_xh4-v_xh3) + v_xr*(p_zh4-p_zh3) + v_zr*(p_xh3-p_xh4) = p_xh3*v_zh3 - p_xh4*v_zh4 + p_zh4*v_xh4 - p_zh3*v_xh3
        
        The system is equivalent to the matrix form:
        | (v_yh1-v_yh2) (v_xh2-v_xh1) 0             (p_yh2-p_yh1) (p_xh1-p_xh2) 0             | | p_xr | = | p_xh1*v_yh1 - p_xh2*v_yh2 + p_yh2*v_xh2 - p_yh1*v_xh1 |
        | (v_zh1-v_zh2) 0             (v_xh2-v_xh1) (p_zh2-p_zh1) 0             (p_xh1-p_xh2) | | p_yr | = | p_xh1*v_zh1 - p_xh2*v_zh2 + p_zh2*v_xh2 - p_zh1*v_xh1 |
        | (v_yh2-v_yh3) (v_xh3-v_xh2) 0             (p_yh3-p_yh2) (p_xh2-p_xh3) 0             | | p_zr | = | p_xh2*v_yh2 - p_xh3*v_yh3 + p_yh3*v_xh3 - p_yh2*v_xh2 |
        | (v_zh2-v_zh3) 0             (v_xh3-v_xh2) (p_zh3-p_zh2) 0             (p_xh2-p_xh3) | | v_xr | = | p_xh2*v_zh2 - p_xh3*v_zh3 + p_zh3*v_xh3 - p_zh2*v_xh2 |
        | (v_yh3-v_yh4) (v_xh4-v_xh3) 0             (p_yh4-p_yh3) (p_xh3-p_xh4) 0             | | v_yr | = | p_xh3*v_yh3 - p_xh4*v_yh4 + p_yh4*v_xh4 - p_yh3*v_xh3 |
        | (v_zh3-v_zh4) 0             (v_xh4-v_xh3) (p_zh4-p_zh3) 0             (p_xh3-p_xh4) | | v_zr | = | p_xh3*v_zh3 - p_xh4*v_zh4 + p_zh4*v_xh4 - p_zh3*v_xh3 |

        Now we can implement the final equation system in matrix form and solve it with Cramer's rule!
        */

        // Hailstone constants
        const p_xh1 = hailstones[0].position.x;
        const p_yh1 = hailstones[0].position.y;
        const p_zh1 = hailstones[0].position.z;
        const v_xh1 = hailstones[0].velocity.x;
        const v_yh1 = hailstones[0].velocity.y;
        const v_zh1 = hailstones[0].velocity.z;

        const p_xh2 = hailstones[1].position.x;
        const p_yh2 = hailstones[1].position.y;
        const p_zh2 = hailstones[1].position.z;
        const v_xh2 = hailstones[1].velocity.x;
        const v_yh2 = hailstones[1].velocity.y;
        const v_zh2 = hailstones[1].velocity.z;
        
        const p_xh3 = hailstones[2].position.x;
        const p_yh3 = hailstones[2].position.y;
        const p_zh3 = hailstones[2].position.z;
        const v_xh3 = hailstones[2].velocity.x;
        const v_yh3 = hailstones[2].velocity.y;
        const v_zh3 = hailstones[2].velocity.z;

        const p_xh4 = hailstones[3].position.x;
        const p_yh4 = hailstones[3].position.y;
        const p_zh4 = hailstones[3].position.z;
        const v_xh4 = hailstones[3].velocity.x;
        const v_yh4 = hailstones[3].velocity.y;
        const v_zh4 = hailstones[3].velocity.z;

        // Equations system: A unknowns = constants
        // Get the coefficient-matrix from four of the many hailstones
        const A = [
            [v_yh1-v_yh2, v_xh2-v_xh1, 0,           p_yh2-p_yh1, p_xh1-p_xh2,  0          ],
            [v_zh1-v_zh2, 0,           v_xh2-v_xh1, p_zh2-p_zh1, 0,            p_xh1-p_xh2],
            [v_yh2-v_yh3, v_xh3-v_xh2, 0,           p_yh3-p_yh2, p_xh2-p_xh3,  0          ],
            [v_zh2-v_zh3, 0,           v_xh3-v_xh2, p_zh3-p_zh2, 0,            p_xh2-p_xh3],
            [v_yh3-v_yh4, v_xh4-v_xh3, 0,           p_yh4-p_yh3, p_xh3-p_xh4,  0          ],
            [v_zh3-v_zh4, 0,           v_xh4-v_xh3, p_zh4-p_zh3, 0,            p_xh3-p_xh4]
        ];
        //console.log(A);
        // Rock unknowns
        let p_xr, p_yr, p_zr, v_xr, v_yr, v_zr;
        let unknowns = [
            p_xr,
            p_yr,
            p_zr,
            v_xr,
            v_yr,
            v_zr
        ];
        const constants = [
            p_xh1*v_yh1 - p_xh2*v_yh2 + p_yh2*v_xh2 - p_yh1*v_xh1,
            p_xh1*v_zh1 - p_xh2*v_zh2 + p_zh2*v_xh2 - p_zh1*v_xh1,
            p_xh2*v_yh2 - p_xh3*v_yh3 + p_yh3*v_xh3 - p_yh2*v_xh2,
            p_xh2*v_zh2 - p_xh3*v_zh3 + p_zh3*v_xh3 - p_zh2*v_xh2,
            p_xh3*v_yh3 - p_xh4*v_yh4 + p_yh4*v_xh4 - p_yh3*v_xh3,
            p_xh3*v_zh3 - p_xh4*v_zh4 + p_zh4*v_xh4 - p_zh3*v_xh3
        ];
        //console.log(constants);

        // Assumes the matrix will always be square
        const det = matrix => {
            // Base-case: 2x2 matrix
            if(matrix.length === 2) {
                return matrix[0][0]*matrix[1][1] - matrix[0][1]*matrix[1][0];
            } else {
                // Break matrix down into more smaller parts/matrices
                let determinant = 0;
                for(let col = 0; col < matrix.length; col++) {
                    const subMatrix = [];
                    for(let row = 1; row < matrix.length; row++)
                        subMatrix.push(matrix[row].toSpliced(col,1));
                    if(col % 2 === 0)
                        determinant += matrix[0][col]*det(subMatrix);
                    else
                        determinant -= matrix[0][col]*det(subMatrix);
                }
                return determinant;
            }
        };
        
        const determinant = det(A);
        if(determinant === 0) {
            console.log("|A| = 0 which makes Cramer's rule not applicable D:");
            return;
        }

        // We now know we can use Cramer's rule to solve the equation systems to get the values for each unknown!
        // I.e. there will only be one unique solution, and we have as many equations as unknowns! (+|A| !== 0)

        const cramersRule = unknown => {
            // Substitute answers to current unknown column
            const modifiedMatrix = structuredClone(A);
            modifiedMatrix.map((row, i) => row[unknown] = constants[i]);
            
            return det(modifiedMatrix) / determinant;
        };
        // Solve for every unknown
        for(let unknown = 0; unknown < unknowns.length; unknown++) {
            unknowns[unknown] = Math.round(cramersRule(unknown));
        }
        //console.log(unknowns);

        const result = unknowns[0] + unknowns[1] + unknowns[2];
        console.log(result);

    } catch (err) {
        console.log(err);
    }
}
example();