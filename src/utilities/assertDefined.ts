// import mongoose from "mongoose"

// export const assertDefined = <T>(val: T): asserts val is NonNullable<T> => {
//     if(!val){
//         throw Error("Expected 'VAL to be defined , but received" + val)
//     }
// };




export const assertDefined: <T>(val: T) => asserts val is NonNullable<T> = <T>(val: T): asserts val is NonNullable<T> => {
    if (val === null || val === undefined) {
        throw new Error(`Expected 'val' to be defined, but received ${val}`);
    }
};


