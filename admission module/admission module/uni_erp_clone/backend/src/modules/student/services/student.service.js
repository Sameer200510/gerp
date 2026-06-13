const studentRepository = require('../repositories/student.repository');

class StudentService {
  async getProfile(userId) {
    const profile = await studentRepository.getProfileByUserId(userId);
    return profile || null;
  }

  async updateProfile(userId, profileData) {
    return await studentRepository.upsertProfile(userId, profileData);
  }
}

module.exports = new StudentService();
