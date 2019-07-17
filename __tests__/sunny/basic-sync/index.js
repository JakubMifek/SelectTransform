import { ConditionSyncTest } from "./condition";
import { GeneralSyncTest } from "./general";
import { OptionalSyncTest } from "./optional";
import { LetSyncTest } from "./let";
import { ConcatSyncTest } from "./concat";
import { MergeSyncTest } from "./merge";
import { EachSyncTest } from "./each";
import { FlattenSyncTest } from "./flatten";

export const tests = [
    GeneralSyncTest,
    ConditionSyncTest,
    OptionalSyncTest,
    FlattenSyncTest,
    LetSyncTest,
    ConcatSyncTest,
    MergeSyncTest,
    EachSyncTest
];