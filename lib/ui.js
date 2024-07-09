/**
 * @param {import('terminal-kit').Terminal} term
 * @return {Promise<boolean>}
 */
export async function yesOrNo(term) {
        return new Promise((resolve, reject) => {
                term.yesOrNo(
                        {
                                yes: ["y", "Y"],
                                no: ["n", "N", "ENTER"],
                                echoNo: "no",
                                echoYes: "yes",
                        },
                        (error, result) => {
                                term.grabInput(false);
                                if (error) reject(new Error(error));
                                resolve(result);
                        }
                );
        });
}
