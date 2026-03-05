export declare class CreateMenuDto {
    name: string;
    price: number;
    description?: string;
    category: string;
    imageUrl?: string;
    sortOrder?: number;
}
declare const UpdateMenuDto_base: import("@nestjs/common").Type<Partial<CreateMenuDto>>;
export declare class UpdateMenuDto extends UpdateMenuDto_base {
}
export declare class UpdateMenuSortDto {
    items: {
        id: string;
        sortOrder: number;
    }[];
}
export {};
