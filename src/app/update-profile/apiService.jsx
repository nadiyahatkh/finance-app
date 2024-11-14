import { getSession } from "next-auth/react";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const updateProfileAdmin = async ({ data }) => {
    const session = await getSession()
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('username', data.username);
      formData.append('email', data.email);
      if (data.password) {
          formData.append('password', data.password);
      }
      if (data.path) {
        formData.append('path', data.path);
    }
  
      
      const response = await fetch(`${BASE_URL}/api/submission/update/profiles/admin`, {
        method: 'POST',
        headers: {
          "ngrok-skip-browser-warning": true,
          'Authorization': `Bearer ${session.user.token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const result = await response.text();
        throw new Error(result);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log('Error creating aset:', error);
      throw error;
    }
  };

  export const fetchProfileAdminId = async () => {
    const session = await getSession()
    try {
      const response = await fetch(`${BASE_URL}/api/submission/profiles/admin`, {
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
  }