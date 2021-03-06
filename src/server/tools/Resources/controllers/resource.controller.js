"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var mongodb_1 = require("mongodb");
var ResourceController = /** @class */ (function () {
    function ResourceController() {
        var _this = this;
        /**
         *
         * Get a single record of a resource
         *
         * @param {Express.Request} req
         *
         * @param {Express.Response} res
         *
         * @return {Express.Response}
         *
         */
        this.show = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var resource;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.lucent.database.find(req.lucent.resource.collection(), req.params.resource)];
                    case 1:
                        resource = _a.sent();
                        if (!resource) {
                            return [2 /*return*/, res.status(404).json({
                                    message: 'Resource not found.'
                                })];
                        }
                        return [4 /*yield*/, this.resolveComputedFields(req, resource)];
                    case 2:
                        resource = _a.sent();
                        return [2 /*return*/, res.json(resource)];
                }
            });
        }); };
        /**
         *
         * Fetch all data from specific resource collection
         *
         * @param {Express.Request} req
         *
         * @param {Express.Response} res
         *
         * @return {Express.Response}
         *
         */
        this.search = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var filter, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filter = this.buildFilter(req);
                        return [4 /*yield*/, req.lucent.database.fetch(req.lucent.resource.collection(), {
                                limit: req.query.per_page || req.lucent.resource.perPage(),
                                page: req.query.page || 1
                            }, filter)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, res.json(data)];
                }
            });
        }); };
        this.getCustomFilters = function (req, resource) {
            return resource
                .filters()
                .map(function (filter) {
                return (req.query.filters || {})[filter.attribute()]
                    ? function (builder) {
                        return filter.apply(req, builder, (req.query.filters || {})[filter.attribute()]);
                    }
                    : false;
            })
                .filter(Boolean);
        };
        /**
         *
         * Fetch data from specific resource collection
         *
         * @param {Express.Request} req
         *
         * @param {Express.Response} res
         *
         * @return {Express.Response}
         *
         */
        this.fetch = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var filter, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filter = this.buildFilter(req);
                        return [4 /*yield*/, req.lucent.database.fetch(req.lucent.resource.collection(), {
                                limit: req.query.per_page || req.lucent.resource.perPage(),
                                page: req.query.page || 1
                            }, filter, this.getCustomFilters(req, req.lucent.resource))];
                    case 1:
                        data = _a.sent();
                        this.resolveComputedFields(req, data.data);
                        return [2 /*return*/, res.json(data)];
                }
            });
        }); };
        /**
         *
         * Fetch records for a has many relationship
         *
         * @param {Express.Request} req
         *
         * @param {Express.Response} res
         *
         * @return {Express.Response}
         *
         */
        this.fetchHasMany = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var resource, relatedField, relatedResource, filter, data, dataWithComputed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.lucent.database.find(req.lucent.resource.collection(), req.params.resource)];
                    case 1:
                        resource = _a.sent();
                        if (!resource) {
                            return [2 /*return*/, res.status(404).json({
                                    message: 'Resource not found.'
                                })];
                        }
                        relatedField = req.lucent.resource
                            .fields()
                            .find(function (field) { return field.attribute === req.params.relation; });
                        relatedResource = req.lucent.resources.find(function (r) { return r.title() === relatedField.resource; });
                        filter = this.buildFilter(req, relatedResource);
                        return [4 /*yield*/, req.lucent.database.fetch(relatedResource.collection(), {
                                limit: req.query.per_page || relatedResource.perPage(),
                                page: req.query.page || 1
                            }, __assign({ _id: {
                                    $in: (resource[relatedField.attribute] || []).map(function (primaryKey) { return new mongodb_1.ObjectID(primaryKey); })
                                } }, filter), this.getCustomFilters(req, relatedResource))];
                    case 2:
                        data = _a.sent();
                        dataWithComputed = __spreadArrays(data.data);
                        return [4 /*yield*/, this.resolveComputedFields(req, dataWithComputed, relatedResource)];
                    case 3:
                        dataWithComputed = _a.sent();
                        return [2 /*return*/, res.json(__assign(__assign({}, data), { data: dataWithComputed }))];
                }
            });
        }); };
        /**
         *
         * Fetch a record for a has one relationship
         *
         * @param {Express.Request} req
         *
         * @param {Express.Response} res
         *
         * @return {Express.Response}
         *
         */
        this.fetchHasOne = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var parentRecord, relatedField, relatedResource, record;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.lucent.database.find(req.lucent.resource.collection(), req.params.resource)];
                    case 1:
                        parentRecord = _a.sent();
                        if (!parentRecord) {
                            return [2 /*return*/, res.status(404).json({
                                    message: 'Resource not found.'
                                })];
                        }
                        relatedField = req.lucent.resource
                            .fields()
                            .find(function (field) { return field.attribute === req.params.relation; });
                        relatedResource = req.lucent.resources.find(function (r) { return r.name() === relatedField.resource; });
                        record = null;
                        if (!parentRecord[relatedField.attribute]) return [3 /*break*/, 3];
                        return [4 /*yield*/, req.lucent.database.find(relatedResource.collection(), parentRecord[relatedField.attribute])];
                    case 2:
                        record = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!record) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.resolveComputedFields(req, record, relatedResource)];
                    case 4:
                        record = _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, res.json(record || null)];
                }
            });
        }); };
    }
    /**
     *
     * Fetch all data from specific resource collection
     *
     * @param {Express.Request} req
     *
     * @param {Express.Response} res
     *
     * @return {Express.Response}
     *
     */
    ResourceController.prototype.fetchAll = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.lucent.database.fetchAll(req.lucent.resource.collection())];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, res.json(data)];
                }
            });
        });
    };
    /**
     *
     * Build the filter based on query params
     *
     * @param {Express.Request} req
     *
     * @param {Express.Response} res
     *
     * @return {FilterQuery}
     *
     */
    ResourceController.prototype.buildFilter = function (req, resource) {
        var filter = {};
        if (req.query.query) {
            filter = {
                $or: []
            };
            var searchableFields = (resource || req.lucent.resource)
                .fields()
                .filter(function (field) { return field.isSearchable; });
            if (searchableFields.length === 0) {
                filter = {};
            }
            else {
                searchableFields.forEach(function (field) {
                    var _a;
                    (filter.$or || []).push((_a = {},
                        _a[field.attribute] = new RegExp(req.query.query, 'i'),
                        _a));
                });
            }
        }
        return filter;
    };
    /**
     *
     * Store record for a specific resource collection
     *
     * @param {Express.Request} req
     *
     * @param {Express.Response} res
     *
     * @return {Express.Response}
     *
     */
    ResourceController.prototype.store = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var request, resource;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.lucent.resource.beforeInsert(req)];
                    case 1:
                        request = _a.sent();
                        return [4 /*yield*/, req.lucent.database.insert(req.lucent.resource.collection(), request.body)];
                    case 2:
                        resource = _a.sent();
                        return [4 /*yield*/, req.lucent.resource.afterInsert(request)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, res.json(resource)];
                }
            });
        });
    };
    /**
     *
     * Upload a file for a collection
     *
     * @param {Express.Request} req
     *
     * @param {Express.Response} res
     *
     * @return {Express.Response}
     *
     * TODO: implement a middleware to fetch the validation error for
     * this upload and validate. Also exclude the file
     * validations when creating/updating a
     * resource.
     *
     */
    ResourceController.prototype.upload = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, file_1, path;
            return __generator(this, function (_a) {
                id = uuid_1.v4();
                if (req.files && req.files.file) {
                    file_1 = req.files.file;
                    path = process.cwd() + "/storage/" + id + "." + file_1.name
                        .split('.')
                        .pop();
                    file_1.mv(path, function () {
                        return res.json("/storage/" + id + "." + file_1.name.split('.').pop());
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     *
     * Update a record for a specific resource collection
     *
     * @param {Express.Request} req
     *
     * @param {Express.Response} res
     *
     * @return {Express.Response}
     *
     */
    ResourceController.prototype.update = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data, parentRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = req.body;
                        return [4 /*yield*/, req.lucent.database.update(req.lucent.resource.collection(), req.params.resource, data)];
                    case 1:
                        parentRecord = (_a.sent()).value;
                        return [2 /*return*/, res.json(parentRecord)];
                }
            });
        });
    };
    /**
     *
     * Run a resource action on a selected list of resources.
     *
     * @param {Express.Request} req
     *
     * @param {Express.Response} res
     *
     * @return {Express.Response}
     *
     */
    ResourceController.prototype.action = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, actionId, resources, action, collection;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, actionId = _a.action, resources = _a.resources;
                        action = req.lucent.resource
                            .actions()
                            .find(function (a) { return a.id === actionId; });
                        return [4 /*yield*/, req.lucent.database.fetchByIds(req.lucent.resource.collection(), resources)
                            /**
                             *
                             * Run the handle method on the action, passing in
                             * the database connection, request object
                             * and collection of models
                             *
                             */
                        ];
                    case 1:
                        collection = _b.sent();
                        /**
                         *
                         * Run the handle method on the action, passing in
                         * the database connection, request object
                         * and collection of models
                         *
                         */
                        return [4 /*yield*/, action.handle(req.lucent.database
                                .get()
                                .collection(req.lucent.resource.collection()), req, collection.map(function (item) { return (__assign(__assign({}, item), { _id: new mongodb_1.ObjectID(item._id) })); }))
                            /**
                             *
                             * Resolve and return the message for this action.
                             * This could come from the action definition,
                             * or a default message from lucent.
                             * TODO: Do this.
                             *
                             */
                        ];
                    case 2:
                        /**
                         *
                         * Run the handle method on the action, passing in
                         * the database connection, request object
                         * and collection of models
                         *
                         */
                        _b.sent();
                        /**
                         *
                         * Resolve and return the message for this action.
                         * This could come from the action definition,
                         * or a default message from lucent.
                         * TODO: Do this.
                         *
                         */
                        return [2 /*return*/, res.json({})];
                }
            });
        });
    };
    /**
     *
     * Delete a resource from specific resource collection
     *
     * @param {Express.Request} req
     *
     * @param {Express.Response} res
     *
     * @return {Express.Response}
     *
     */
    ResourceController.prototype.delete = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.lucent.database.destroy(req.lucent.resource.collection(), req.body.resources)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, res.json(data)];
                }
            });
        });
    };
    /**
     *
     * Clear all records from specific resource collection
     *
     * @param {Express.Request} req
     *
     * @param {Express.Response} res
     *
     * @return {Express.Response}
     *
     */
    ResourceController.prototype.clear = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.lucent.database.clear(req.params.slug)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, res.json({})];
                }
            });
        });
    };
    /**
     *
     * This method resolves all computed fields for a resource
     * @param {Array/Object} data
     *
     * @return {Array/Object}
     */
    ResourceController.prototype.resolveComputedFields = function (req, data, resource) {
        return __awaiter(this, void 0, void 0, function () {
            var computedFields, results;
            return __generator(this, function (_a) {
                computedFields = (resource || req.lucent.resource)
                    .fields()
                    .filter(function (field) { return field.computed; });
                results = Array.isArray(data)
                    ? __spreadArrays(data) : __assign({}, data);
                // first we'll check if it's an array or an object
                if (Array.isArray(results)) {
                    // yep, it's a collection of documents
                    /**
                     *
                     * To have some control, let's make this synchronous for now. If it doesn't pose
                     * any performance issues then we can make it async
                     *
                     */
                    computedFields.forEach(function (field) {
                        results.forEach(function (item) {
                            item[field.attribute] = field.computedResolver(item);
                        });
                    });
                    return [2 /*return*/, results];
                }
                // it's a single document
                computedFields.forEach(function (field) {
                    results[field.attribute] = field.computedResolver(results);
                });
                return [2 /*return*/, results];
            });
        });
    };
    return ResourceController;
}());
exports.Resource = new ResourceController();
