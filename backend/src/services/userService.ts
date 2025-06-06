import { prisma } from '../prisma';

/**
 * User service for handling user-related database operations
 */
export class UserService {
  /**
   * Find a user by their ID
   */
  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Find a user by their email address
   */
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find user with their preferences
   */
  async findWithPreferences(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: { preferences: true },
    });
  }

  /**
   * Find user with their tone profile
   */
  async findWithToneProfile(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: { toneProfile: true },
    });
  }

  /**
   * Create a new user
   */
  async create(userData: any) {
    return prisma.user.create({
      data: userData,
    });
  }

  /**
   * Update a user
   */
  async update(id: number, userData: any) {
    return prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  /**
   * Update user preferences
   */
  async updatePreferences(userId: number, preferences: any) {
    return prisma.userPreference.update({
      where: { userId },
      data: preferences,
    });
  }

  /**
   * Update user tone profile
   */
  async updateToneProfile(userId: number, toneData: any) {
    return prisma.toneProfile.update({
      where: { userId },
      data: toneData,
    });
  }

  /**
   * Delete a user and all related data
   */
  async delete(id: number) {
    return prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Record login history for a user
   */
  async recordLogin(
    userId: number, 
    ipAddress: string, 
    userAgent: string, 
    success: boolean = true
  ): Promise<void> {
    await prisma.loginHistory.create({
      data: {
        userId,
        ipAddress,
        userAgent,
        success,
      },
    });
  }
} 