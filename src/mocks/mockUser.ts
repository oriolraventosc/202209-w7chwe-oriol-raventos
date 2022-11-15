const mockUser: MockType = {
  _id: "12345",
  username: "Juan",
  password: "juan2",
  email: "juan@gmail.com",
  image: "default.webp",
};

interface MockType {
  username: string;
  password: string;
  email: string;
  image: string;
  _id?: string;
}
export default mockUser;
