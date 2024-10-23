const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const fetchSubmission = async ({token}) => {
    try {
      const response = await fetch(`${BASE_URL}/api/dataApplicant/index`, {
        headers: {
          'Authorization': `Bearer ${token}`,
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