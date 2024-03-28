import {Block} from "./entities/Block.js";
import {Field} from "./entities/Field.js";
import {patters} from "./patterns/FieldPatterns.js";
import {startTickEvent} from "./libs/StorageLibs.js";

const field = new Field();
field.generateFiledFromPattern(patters[0]);