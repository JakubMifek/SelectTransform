import { ConditionTest } from "./condition";
import { GeneralTest } from "./general";
import { OptionalTest } from "./optional";
import { FlattenTest } from "./flatten";
import { LetTest } from "./let";
import { ConcatTest } from "./concat";
import { MergeTest } from "./merge";
import { EachTest } from "./each";

export const tests = [
    GeneralTest,
    ConditionTest,
    OptionalTest,
    FlattenTest,
    LetTest,
    ConcatTest,
    MergeTest,
    EachTest
];