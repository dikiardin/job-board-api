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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRepository = void 0;
const Q = __importStar(require("./job.query.repository"));
const M = __importStar(require("./job.mutation.repository"));
class JobRepository {
    static async getCompany(companyId) {
        return Q.getCompany(companyId);
    }
    static async createJob(companyId, data) {
        return M.createJob(companyId, data);
    }
    static async updateJob(companyId, jobId, data) {
        return M.updateJob(companyId, jobId, data);
    }
    static async getJobById(companyId, jobId) {
        return Q.getJobById(companyId, jobId);
    }
    static async getJobBySlug(jobSlug) {
        return Q.getJobBySlug(jobSlug);
    }
    static async togglePublish(jobId, isPublished) {
        return M.togglePublish(jobId, isPublished);
    }
    static async deleteJob(companyId, jobId) {
        return M.deleteJob(companyId, jobId);
    }
    static async listJobs(params) {
        return Q.listJobs(params);
    }
    static async listPublishedJobs(params) {
        return Q.listPublishedJobs(params);
    }
    static async getJobPublic(jobId) {
        return Q.getJobPublic(jobId);
    }
    static async listApplicantsForJob(params) {
        return Q.listApplicantsForJob(params);
    }
}
exports.JobRepository = JobRepository;
