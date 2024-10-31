import { getSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const fetchSubmission = async ({token, search, type, finish_status}) => {
  const session = await getSession()
  const statusParams = finish_status.map(s => `finish_status[]=${s}`).join('&');
    const typeParams = type.map(t => `type[]=${t}`).join('&');
    try {
      const response = await fetch(`${BASE_URL}/api/dataApplicant/index?search=${search}&${typeParams}&${statusParams}`, {
        headers: {
          "ngrok-skip-browser-warning": true,
          'Authorization': `Bearer ${session.user.token}`,
        }
      })
      .then((res) => res.json())
      .then((data) => {
       return {
        data: data,
        message: "successs"
       }
      })
      return response.data
    } catch (error) {
      console.error(error);
      return "abs"
    }
  };