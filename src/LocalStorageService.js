const LocalStorageService = {
  getItem(key) {
    return localStorage.getItem(key);
  },
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem(key) {
    localStorage.removeItem(key);
  },
  logout() {

    LocalStorageService.removeItem("token");
    LocalStorageService.removeItem("name");
    LocalStorageService.removeItem("branch_id");
    LocalStorageService.removeItem("professional_id");
    LocalStorageService.removeItem("charge");
    LocalStorageService.removeItem("charge_id");
    LocalStorageService.removeItem("nameBranch");
    LocalStorageService.removeItem("nameBusiness");
    LocalStorageService.removeItem("imageBusiness");
    LocalStorageService.removeItem("image");
    LocalStorageService.removeItem("business_id");
    LocalStorageService.removeItem("permissionsUser");
    LocalStorageService.removeItem("authenticateUser");
  },

  // Nuevo método para manejar el estado de bloqueo
  getIsLocked() {
    const isLocked = localStorage.getItem('isLocked');
    return JSON.parse(isLocked);
  },

  setIsLocked(value) {
    localStorage.setItem('isLocked', JSON.stringify(value));
  }
};

export default LocalStorageService;