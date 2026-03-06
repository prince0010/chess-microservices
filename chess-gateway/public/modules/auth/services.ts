// modules/auth/services.ts
import bcrypt from "bcryptjs"
import User from "@/models/User"

const loginUser = async (username: string, password: string) => {
  console.log("Login attempt with:", username);

  const user = await User.findOne({
    $or: [
      { username: { $regex: new RegExp(`^${username.trim()}$`, 'i') } },
      { email: { $regex: new RegExp(`^${username.trim()}$`, 'i') } }
    ],
    status: true,
    isActive: true
  }).populate('coachId');

  console.log("User found:", !!user);
  if (user) {
    console.log("User role:", user.role);
    console.log("User email:", user.email); // This should show the email
    console.log("User username:", user.username);
    console.log("User coachId:", user.coachId);
  }

  if (!user) throw new Error("User not found");

  const doesPasswordMatch = await bcrypt.compare(password, user.password);
  if (!doesPasswordMatch) throw new Error("Invalid password");

  // Convert to object and remove password
  const { password: removedPassword, ...authUser } = user.toObject();

  // Handle coachId if it's populated
  if (authUser.coachId && typeof authUser.coachId === 'object') {
    authUser.coachId = authUser.coachId._id.toString();
  }

  // Log what's being returned
  console.log("Returning user object:", authUser);

  return authUser;
};

const changePassword = async (id: string, newPassword: string) => {
  const user = await User.findById(id)
  if (!user) throw new Error("User not found")

  return User.findByIdAndUpdate(
    id,
    { password: await bcrypt.hash(newPassword, 10) },
    { new: true }
  )
}

const authService = {
  loginUser,
  changePassword,
}

export default authService