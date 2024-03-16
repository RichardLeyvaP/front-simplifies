import { defineStore } from "pinia";
export const UserTokenStore = defineStore("UserTokenStore", {
  state: () => {
    return {
      userToken: "",
      userName: "",
      branch_id: "",
      professional_id: "",
      charge: "",
      nameBranch: "",
      nameBusiness: "",
      image: "",
      business_id: "",
      user_id: "",
      permissionsUser: [] as string[],
      authenticateUser: ""
    };
  },
  actions: {
    setUserUser_id(user_id: string){
      this.user_id = user_id;
    },
    setUserToken(userToken: string){
      this.userToken = userToken;
    },
    setUserName(userName: any) {
      this.userName = userName;
    },
    setBranchId(branch_id: number) {
      this.branch_id = branch_id;
    },
    setProfessionalId(professional_id: number) {
      this.professional_id = professional_id;
    },
    setCharge(charge: string) {
      this.charge = charge;
    },
    setNameBranch(nameBranch: string) {
      this.nameBranch = nameBranch;
    },
    setNameBusiness(nameBusiness: string) {
      this.nameBusiness = nameBusiness;
    },
    setImage(image: string) {
      this.image = image;
    },
    setBusinessId(business_id: number) {
      this.business_id = business_id;
    },
    setPermissionsUser(permissionsUser: string[]) {
      this.permissionsUser = permissionsUser;
    },
    setAuthenticateUser(authenticateUser: boolean) {
      this.authenticateUser = authenticateUser;
    },
    logout() {
      this.userToken = "";
      this.userName = "";
      this.branch_id = "";
      this.professional_id = "";
      this.charge = "";
      this.nameBranch = "";
      this.nameBusiness = "";
      this.image = "";
      this.business_id = "";
      this.permissionsUser= [];
      this.authenticateUser = "";
      this.user_id = "";
    },
  },
  persist: {    
    storage: sessionStorage,
    paths: ["userToken", "userName", "branch_id", "professional_id", "charge", "nameBranch", "nameBusiness", "image", "business_id"],
  },
});