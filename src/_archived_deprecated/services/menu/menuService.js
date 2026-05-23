import { serviceClient } from '../../http/serviceClient';

class MenuService {
  async getMenuItems(userRole) {
    return await serviceClient('/menu', {
      params: { role: userRole }
    });
  }

  async getNavigationItems() {
    return await serviceClient('/menu/navigation');
  }
}

export const menuService = new MenuService();

export default menuService;
