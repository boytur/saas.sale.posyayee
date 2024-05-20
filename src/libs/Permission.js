import { getUuid } from "./localStrage";
import userDecode from "./userDecode";

class Permission {

    constructor() {
        this.role = (userDecode(getUuid()))?.user?.user_role || '';
        this.user_acc_verify = (userDecode(getUuid()))?.user?.user_acc_verify || '';
    }

    canGetOrderSessionId() {
        if (this.role === "owner" && this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canGetOrderOpenOrder() {
        if (this.role === "owner" && this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canLogout() {
        if (this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canViewHistory() {
        if ((this.role === 'owner' || this.role === 'manager') && this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canViewStoreUser() {
        if ((this.role === 'owner' || this.role === 'manager') && this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canViewProduct() {
        if ((this.role === 'owner' || this.role === 'employee' || this.role === 'manager') && this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canViewDashboard() {
        if ((this.role === 'owner' || this.role === 'manager') && this.user_acc_verify) {
            return true;
        }
        return false;
    }


    canViewFinance() {
        if ((this.role === 'owner' || this.role === 'employee' || this.role === 'manager') && this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canSettingOwnAccount() {
        if ((this.role === 'owner' || this.role === 'employee' || this.role === 'manager') && this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canSettingStore() {
        if ((this.role === 'owner' || this.role === 'manager') && this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canSellProducts() {
        if ((this.role === 'owner' || this.role === 'employee' || this.role === 'manager') && this.user_acc_verify) {
            return true;
        }
        return false;
    }

    canManageEmployees() {
        if (this.role === 'god' || this.role === 'owner' || this.role === 'manager') {
            return true;
        }
        return false;
    }
}

export default Permission;
