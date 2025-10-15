import { CVData, CVAdditionalInfo } from "./cv.types";
export declare class CVDataService {
    static getUserData(userId: number): Promise<any>;
    static transformUserDataToCVData(user: any, additionalInfo?: CVAdditionalInfo): CVData;
    static mergeAdditionalInfo(cvData: CVData, additionalInfo?: CVAdditionalInfo): CVData;
}
//# sourceMappingURL=cv.data.service.d.ts.map