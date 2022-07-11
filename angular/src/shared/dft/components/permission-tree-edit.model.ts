import { FlatPermissionDto, FlatTreeSelectDto } from '../../service-proxies/service-proxies';

/* tslint:disable */
export interface PermissionTreeEditModel {
    data: FlatPermissionDto[];
    selectedData: number[];
    permissions: FlatPermissionDto[];
    grantedPermissionNames: string[];
}
export interface MultiSelectTree {
    data: FlatTreeSelectDto[];
    selectedData: number[];
}