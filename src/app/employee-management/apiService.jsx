import { getSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL


export const fetchEmployee = async ({token}) => {
  const session = await getSession()
    try {
      const response = await fetch(`${BASE_URL}/api/users`, {
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

  export const createEmployee = async ({ data, token, file }) => {
    const session = await getSession()
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('department_id', data.department_id);
      formData.append('position_id', data.position_id);
      formData.append('bank_id', data.bank_id);
      formData.append('manager_id', data.manager_id);
      formData.append('account_name', data.account_name);
      formData.append('account_number', data.account_number);
      if (file) {
        formData.append('path', file);
      }

  
      const response = await fetch(`${BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          "ngrok-skip-browser-warning": true,
          'Authorization': `Bearer ${session.user.token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        const result = await response.text();
        console.log("Response error detail:", result);
        throw new Error(result.message || "somthing wrong");
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.log('Error creating users:', error);
      throw error;
    }
  };

  export const removeEmployee = async ({ id, token }) => {
    const session = await getSession()
    try {
      const response = await fetch(`${BASE_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          "ngrok-skip-browser-warning": true,
          'Authorization': `Bearer ${session.user.token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to remove item');
      }
      return await response.json();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

export const fetchDepartments = async ({token}) => {
  const session = await getSession()
    try {
      const response = await fetch(`${BASE_URL}/api/department`, {
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

export const fetchPositions = async ({token}) => {
  const session = await getSession()
    try {
      const response = await fetch(`${BASE_URL}/api/positions`, {
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

  // export const createEmployee = async ({ data, token }) => {
        
  //   try {
  //     const formData = new FormData();
  //     formData.append('name', data.name);
  //     formData.append('email', data.email);
  //     formData.append('password', data.password);
  //     formData.append('nip', data.nip);
  //     formData.append('department_id', data.department_id);
  //     formData.append('position_id', data.position_id);

  
  //     const response = await fetch('${BASE_URL}/api/employee/create', {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       body: formData,
  //     });
  
  //     if (!response.ok) {
  //       const result = await response.text();
  //       throw new Error(result);
  //     }
  
  //     const result = await response.json();
  //     return result;
  //   } catch (error) {
  //     console.log('Error creating aset:', error);
  //     throw error;
  //   }
  // };

