"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteButton = exports.reorderButtons = exports.editButton = exports.createButton = exports.getButtons = exports.createCollection = exports.getCollections = void 0;
var server_1 = require("$app/server");
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("$lib/server/db");
var schema_1 = require("$lib/server/db/schema");
var vb = __importStar(require("valibot"));
var kit_1 = require("@sveltejs/kit");
var path_1 = __importDefault(require("path"));
var ButtonEditModal_svelte_1 = require("$lib/components/ButtonEditModal.svelte");
exports.getCollections = (0, server_1.query)(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.collectionTable)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
exports.createCollection = (0, server_1.form)(vb.object({
    label: vb.string(),
}), function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.insert(schema_1.collectionTable).values(data).returning()];
            case 1:
                result = _a.sent();
                return [4 /*yield*/, (0, exports.getCollections)().refresh()];
            case 2:
                _a.sent();
                (0, kit_1.redirect)(303, "/col/".concat(result[0].id));
                return [2 /*return*/];
        }
    });
}); });
exports.getButtons = (0, server_1.query)(vb.string(), function (collectionId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db
                    .select()
                    .from(schema_1.buttonTable)
                    .where((0, drizzle_orm_1.eq)(schema_1.buttonTable.collectionId, collectionId))
                    .orderBy(schema_1.buttonTable.order)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
exports.createButton = (0, server_1.command)(vb.object({
    collectionId: vb.string(),
    scriptPath: vb.string(),
}), function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var parsedPath, defaultName, result;
    var collectionId = _b.collectionId, scriptPath = _b.scriptPath;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                parsedPath = path_1.default.parse(scriptPath);
                defaultName = parsedPath.name
                    // Title case after underscores/dashes
                    .split(/[_-]/)
                    .map(function (part) { return part.charAt(0).toUpperCase() + part.slice(1); })
                    .join(" ");
                return [4 /*yield*/, db_1.db.transaction(function (tx) { return __awaiter(void 0, void 0, void 0, function () {
                        var lastButtonOrder;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, tx
                                        .select()
                                        .from(schema_1.buttonTable)
                                        .where((0, drizzle_orm_1.eq)(schema_1.buttonTable.collectionId, collectionId))
                                        .orderBy((0, drizzle_orm_1.desc)(schema_1.buttonTable.order))
                                        .limit(1)
                                        .then(function (res) { var _a, _b; return (_b = (_a = res[0]) === null || _a === void 0 ? void 0 : _a.order) !== null && _b !== void 0 ? _b : -1; })];
                                case 1:
                                    lastButtonOrder = _a.sent();
                                    return [4 /*yield*/, tx
                                            .insert(schema_1.buttonTable)
                                            .values({
                                            collectionId: collectionId,
                                            script: scriptPath,
                                            label: defaultName,
                                            order: lastButtonOrder + 1,
                                        })
                                            .returning()
                                            .then(function (res) { return res[0]; })];
                                case 2: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })];
            case 1:
                result = _c.sent();
                return [4 /*yield*/, (0, exports.getButtons)(collectionId).refresh()];
            case 2:
                _c.sent();
                return [2 /*return*/, {
                        success: true,
                        data: result,
                    }];
        }
    });
}); });
exports.editButton = (0, server_1.form)(ButtonEditModal_svelte_1.buttonEditSchema, function (_a) { return __awaiter(void 0, void 0, void 0, function () {
    var collectionId;
    var id = _a.id, newData = __rest(_a, ["id"]);
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, db_1.db.transaction(function (tx) { return __awaiter(void 0, void 0, void 0, function () {
                    var button;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, tx
                                    .select()
                                    .from(schema_1.buttonTable)
                                    .where((0, drizzle_orm_1.eq)(schema_1.buttonTable.id, id))
                                    .then(function (res) { return res[0]; })];
                            case 1:
                                button = _a.sent();
                                if (!button)
                                    return [2 /*return*/, null];
                                return [4 /*yield*/, tx.update(schema_1.buttonTable).set(newData).where((0, drizzle_orm_1.eq)(schema_1.buttonTable.id, id))];
                            case 2:
                                _a.sent();
                                return [2 /*return*/, button.collectionId];
                        }
                    });
                }); })];
            case 1:
                collectionId = _b.sent();
                if (!collectionId) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, exports.getButtons)(collectionId).refresh()];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3: return [2 /*return*/, { success: collectionId !== null }];
        }
    });
}); });
exports.reorderButtons = (0, server_1.command)(vb.array(vb.string()), function (orderedIds) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.transaction(function (tx) { return __awaiter(void 0, void 0, void 0, function () {
                    var i;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < orderedIds.length)) return [3 /*break*/, 4];
                                return [4 /*yield*/, tx.update(schema_1.buttonTable).set({ order: i }).where((0, drizzle_orm_1.eq)(schema_1.buttonTable.id, orderedIds[i]))];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                i++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
exports.deleteButton = (0, server_1.command)(vb.string(), function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var collectionId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db.transaction(function (tx) { return __awaiter(void 0, void 0, void 0, function () {
                    var button;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, tx
                                    .select()
                                    .from(schema_1.buttonTable)
                                    .where((0, drizzle_orm_1.eq)(schema_1.buttonTable.id, id))
                                    .then(function (res) { return res[0]; })];
                            case 1:
                                button = _a.sent();
                                if (!button)
                                    return [2 /*return*/, null];
                                return [4 /*yield*/, tx.delete(schema_1.buttonTable).where((0, drizzle_orm_1.eq)(schema_1.buttonTable.id, id))];
                            case 2:
                                _a.sent();
                                return [2 /*return*/, button.collectionId];
                        }
                    });
                }); })];
            case 1:
                collectionId = _a.sent();
                if (!collectionId) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, exports.getButtons)(collectionId).refresh()];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=db.remote.js.map