import api from "../../../auth/services/auth.service";

export const dashboardService = {
  async getProfile() {
    const response = await api.get("/student/profile");
    return response.data.profile;
  },

  async getAdmissionStatus() {
    const response = await api.get("/admission/status");
    return response.data.admission;
  },

  async applyAdmission() {
    const response = await api.post("/admission/apply");
    return response.data.admission;
  },
};
