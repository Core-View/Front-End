import { create } from 'zustand';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();
let user_id = 0;
const getInfo = () => {
  user_id = cookies.get(user_id);
};
getInfo();
console.log(user_id);
const userIdInfo = create((set) => ({
  user_id: user_id,
}));

export default userIdInfo;
