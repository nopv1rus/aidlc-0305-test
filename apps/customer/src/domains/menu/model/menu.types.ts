export type MenuBadge = 'signature' | 'popular' | 'new'

export interface Menu {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string | null
  badge: MenuBadge | null
  sortOrder: number
  categoryId: string
}

export interface Category {
  id: string
  name: string
  sortOrder: number
  menus: Menu[]
}

export interface GetMenusResponse {
  categories: Category[]
}
