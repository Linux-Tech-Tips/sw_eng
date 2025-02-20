module.exports.stressTest = stressTest

function genArrays(length, v1, v2, min, max) {
    for(let i = 0; i < length; ++i) {
	v1.push(Math.random() * (max - min) + min);
	v2.push(Math.random() * (max - min) + min);
    }
}

function dot(v1, v2) {
    return v1.reduce((acc, n, i) => acc + (n * v2[i]), 0);
}

function stressTest(size, min, max) {
    let v1 = [];
    let v2 = [];
    genArrays(size, v1, v2, min, max);
    let res = dot(v1, v2);
    console.log("Run with n=" + size + "; min=" + min + "; max=" + max + "; res=" + res);
    return res;
}

/*let t0 = performance.now();
stressTest(1000, 0, 10);
stressTest(1000, 0, 10);
stressTest(1000, 0, 10);
stressTest(1000, 0, 10);
stressTest(1000, 0, 10);
let t1 = performance.now();
console.log("Performance: " + (t1-t0) + "ms");*/
