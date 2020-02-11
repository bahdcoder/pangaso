"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Pluralize = require("pluralize");
var BaseResource = /** @class */ (function () {
    function BaseResource() {
    }
    /**
     *
     * Get the field to use as primary key for this resource
     *
     * @return {string}
     *
     */
    BaseResource.prototype.primaryKey = function () {
        return '_id';
    };
    /**
     *
     * Get the resource name
     *
     * @return {String}
     *
     */
    BaseResource.prototype.name = function () {
        return this.constructor.name;
    };
    /**
     *
     * Get the resource title
     *
     * @return {String}
     *
     */
    BaseResource.prototype.title = function () {
        return Pluralize.plural(this.name());
    };
    /**
     *
     * Get all fields for this resource
     *
     * @return {Array}
     *
     */
    BaseResource.prototype.fields = function () {
        return [];
    };
    /**
     * Get all non computed fields for this resource
     *
     * @return {Array}
     */
    BaseResource.prototype.nonComputedFields = function () {
        return this.fields().filter(function (field) { return !field.computed; });
    };
    /**
     *
     * Get the value to be used to display this resource
     *
     */
    BaseResource.prototype.displayValue = function () {
        return '';
    };
    /**
     *
     * Determine if this resource should be shown in the navigation or not
     */
    BaseResource.prototype.availableForNavigation = function () {
        return true;
    };
    /**
     *
     * Get all actions for this resource
     *
     * @return {Array}
     *
     */
    BaseResource.prototype.actions = function () {
        return [];
    };
    /**
     * Get all filters for a resource
     *
     * @return {Array}
     *
     */
    BaseResource.prototype.filters = function () {
        return [];
    };
    /**
     * Get the schema for this class
     *
     * @return {string}
     *
     */
    BaseResource.prototype.collection = function () {
        return Pluralize.plural(this.name()).toLowerCase();
    };
    /**
     * Determine if current user is authorized to create this resource
     *
     * @return {Boolean}
     *
     */
    BaseResource.prototype.authorizedToCreate = function (user) {
        return true;
    };
    /**
     * Determine if current user is authorized to view this resource
     *
     * @return {Boolean}
     *
     */
    BaseResource.prototype.authorizedToView = function (user) {
        return true;
    };
    /**
     *
     * Return the slug for this resource
     *
     * @return {String}
     *
     */
    BaseResource.prototype.slug = function () {
        return Pluralize.plural(this.name()).toLowerCase();
    };
    /**
     * Determine if current user is authorized to update this resource
     *
     * @return {Boolean}
     *
     */
    BaseResource.prototype.authorizedToUpdate = function (user) {
        return true;
    };
    /**
     * Determine if current user is authorized to delete this resource
     *
     * @return {Boolean}
     *
     */
    BaseResource.prototype.authorizedToDelete = function (user) {
        return true;
    };
    /**
     * Define a hook for modifying this field before it is saved.
     * It receives the data to be saved, and is expected to
     * return the data, maybe modified.
     *
     * @param {Object} data
     *
     * @return {Promise}
     */
    BaseResource.prototype.beforeInsert = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve(data)];
            });
        });
    };
    /**
     * Define a hook for modifying the resource data before it is updated.
     * It received the data to be updated, and is expected to
     * return the data, maybe modified.
     *
     * @param {Object} data
     *
     * @return {Promise}
     *
     */
    BaseResource.prototype.beforeUpdate = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve(data)];
            });
        });
    };
    /**
     *
     * Define the items per page
     *
     * @return {integer}
     *
     */
    BaseResource.prototype.perPage = function () {
        return 10;
    };
    /**
     *
     * Define the items per page options
     *
     * @return {array}
     *
     */
    BaseResource.prototype.perPageOptions = function () {
        return [10, 25, 50, 100];
    };
    /**
     * These would be the permissions available to
     * this resource.
     */
    BaseResource.prototype.permissions = function () {
        return [];
    };
    /**
     *
     * A resource can be serialized
     *
     * @return {Array|Object}
     *
     */
    BaseResource.prototype.serialize = function (user) {
        return {
            name: this.name(),
            slug: this.slug(),
            title: this.title(),
            fields: this.fields(),
            perPage: this.perPage(),
            primaryKey: this.primaryKey(),
            collection: this.collection(),
            permissions: this.permissions(),
            displayValue: this.displayValue(),
            perPageOptions: this.perPageOptions(),
            nonComputedFields: this.nonComputedFields(),
            authorizedToView: this.authorizedToView(user),
            authorizedToCreate: this.authorizedToCreate(user),
            authorizedToUpdate: this.authorizedToUpdate(user),
            authorizedToDelete: this.authorizedToDelete(user),
            displayInNavigation: this.availableForNavigation(),
            actions: this.actions().map(function (action) { return action.serialize(); }),
            filters: this.filters().map(function (filter) { return filter.serialize(); })
        };
    };
    return BaseResource;
}());
exports.BaseResource = BaseResource;
