const prisma = require("../../../config/prisma");

class StudentRepository {
  async getProfileByUserId(userId) {
    return await prisma.studentProfile.findUnique({
      where: { userId },
    });
  }

  async upsertProfile(userId, profileData) {
    return await prisma.studentProfile.upsert({
      where: { userId },
      update: profileData,
      create: {
        userId,
        ...profileData,
      },
    });
  }
}

module.exports = new StudentRepository();
