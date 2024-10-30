import { getSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const fetchAmount = async ({token}) => {
    const session = await getSession()
    try {
        const response = await fetch(`${BASE_URL}/api/dataApplicant/ammount`, {
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
        return "abs";
      }
    };

    export const fetchBanks = async ({token}) => {
      const session = await getSession()
        try {
          const response = await fetch(`${BASE_URL}/api/bank/bank`, {
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