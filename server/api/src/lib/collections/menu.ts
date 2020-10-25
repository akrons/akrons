import { NotFoundError, BadRequestError } from '@akrons/service-utils';
import { IMenuNode, IMenu, IClientMenuNode } from '../../models';
import { Permissions } from './permissions';
import { mongoConnection } from '../mongo';
import { Db, Collection } from 'mongodb';
import { join } from 'path';
import { Views } from './views';
import { DefaultCollection } from './default-collection';

export class Menu extends DefaultCollection<IMenu> {
    private static instance: Menu | undefined;
    private constructor() {
        super();
    }
    public static getInstance(): Menu {
        if (!Menu.instance) {
            Menu.instance = new Menu();
        }
        return Menu.instance;
    }


    async loadMenu(menuId: string, requestPermissions: string[]): Promise<IClientMenuNode[]> {
        let result = await this.get(menuId);
        await Views.getInstance().count('menu', result.id);
        return result.menu
            .filter(x => {
                if (!x.permission || x.permission?.length === 0) {
                    return true;
                }
                if (Permissions.getInstance().hasPermission(x.permission, requestPermissions)) {
                    return true;
                }
                return false;
            })
            .map(x => this.mapToClientMenu(x));
    }



    async loadMenuAsSiteMapXml(menuId: string, requestPermissions: string[], hostName: string | undefined): Promise<string> {
        if (!hostName) {
            throw new BadRequestError();
        }
        let menu: IMenuNode[] = await this.loadMenu(menuId, requestPermissions);
        return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
            menu.map((x, i) => this.menuNodeToXml(x, hostName, i === 0 ? 1 : 0.7)).join('') +
            `</urlset>`;
    }


    async createIndex(db: Db): Promise<void> {
        await this.getCollection(db).createIndex({ id: 1 });
    }
    async canMoveId(id: string, x: IMenu): Promise<boolean> {
        return true;
    }
    updateMap(x: IMenu): Partial<IMenu> {
        return { menu: x.menu };
    }
    insertMap(id: string, x: IMenu): IMenu {
        throw { menu: x.menu, id: id };
    }

    getCollection(db: Db): Collection<IMenu> {
        return db.collection<IMenu>('menu');
    }

    private mapToClientMenu(node: IMenuNode): IClientMenuNode {
        return {
            title: node.title,
            path: node.path,
            children: node.children?.map(x => this.mapToClientMenu(x)),
            external: node.external,
        };
    }

    private menuNodeToXml(node: IMenuNode, hostName: string, priority: number = 0.7): string {
        let result = '';
        if (!node.external) {
            result += `<url><loc>${join(hostName, node.path)}</loc><priority>${priority}</priority></url>`;
        }
        if (node.children) {
            result += node.children.map(x => this.menuNodeToXml(x, hostName, priority / 2)).join('');
        }
        return result;
    }


}
