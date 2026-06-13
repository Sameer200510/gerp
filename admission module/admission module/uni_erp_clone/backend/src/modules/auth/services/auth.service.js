const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRepository = require("../repositories/auth.repository");

class AuthService {
  async login(loginId, password) {
    const user = await authRepository.findUserByLoginId(loginId);

    if (!user) {
      throw new Error("Invalid user ID or password");
    }

    if (user.status !== "ACTIVE") {
      throw new Error("Account is not active");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      throw new Error("Invalid user ID or password");
    }

    const token = jwt.sign(
      {
        id: user.id,
        loginId: user.loginId,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return {
      token,

      user: {
        id: user.id,
        loginId: user.loginId,
        role: user.role,
        status: user.status,
        isFirstLogin: user.isFirstLogin,
      },
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isMatch) {
      throw new Error("Incorrect current password");
    }

    if (newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

    if (!strongPassword.test(newPassword)) {
      throw new Error("Password must contain uppercase, lowercase and number");
    }

    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(newPassword, salt);

    await authRepository.updateUserPassword(userId, passwordHash, false);

    return {
      success: true,
      message: "Password updated successfully",
    };
  }

  async seedUser(loginId, password, role) {
    const existingUser = await authRepository.findUserByLoginId(loginId);

    if (existingUser) {
      return existingUser;
    }

    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(password, salt);

    return await authRepository.createUser({
      loginId,
      passwordHash,
      role,
    });
  }
}

module.exports = new AuthService();
