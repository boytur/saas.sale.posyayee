import Permission from "./Permission";

const permission = new Permission();

const checkRoutePermission = (route) => {
    switch (route) {
        case "/":
            return permission.canSellProducts();
        case "/history":
            return permission.canViewHistory();
        case "/product":
            return permission.canViewProduct();
        case "/finance":
            return permission.canViewFinance();
        case "/dashboard":
            return permission.canViewDashboard();
        case "/setting/account":
            return permission.canSettingOwnAccount();
        case "/setting/store":
            return permission.canSettingStore();
        default:
            return false;
    }
};

export default checkRoutePermission;