import dotenv from "dotenv";

dotenv.config();

const enviroment = {
  port: process.env.PORT,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  mongodbUrl: process.env.MONGODB_URL,
  debug: process.env.DEBUG,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseApiKey: process.env.SUPABASE_API_KEY,
  supabaseBucketImages: process.env.SUPABASE_BUCKET_IMAGES,
};

export default enviroment;
