import { getSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL


export const fetchEmployee = async ({token, page, per_page}) => {
  const session = await getSession()
    try {
      const response = await fetch(`${BASE_URL}/api/users?page=${page}&per_page=${per_page}`, {
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
      formData.append('nip', data.nip);
      formData.append('department_id', data.department_id);
      formData.append('position_id', data.position_id);
      data.bank.forEach((item, index) => {
        formData.append(`bank[${index}][bank_id]`, item.bank_id);
        formData.append(`bank[${index}][account_name]`, item.account_name);
        formData.append(`bank[${index}][account_number]`, item.account_number);
      });
      formData.append('manager_id', data.manager_id);
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
        const result = await response.json();
        // Throw the actual validation error message
        throw new Error(JSON.stringify(result));
    }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.log('Error creating users:', error);
      throw error;
    }
  };

  export const updateUsers = async ({ id, data, token }) => {
        
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('department_id', data.department_id);
      formData.append('position_id', data.position_id);
      data.bank.forEach((item, index) => {
        formData.append(`bank[${index}][bank_id]`, item.bank_id);
        formData.append(`bank[${index}][account_name]`, item.account_name);
        formData.append(`bank[${index}][account_number]`, item.account_number);
      });
      formData.append('manager_id', data.manager_id);
      if (data.password) {
        formData.append('password', data.password);
      }
      if (data.path && data.path.length > 0) {
        formData.append('path', data.path[0]);  // Assuming path is an array of files
    }

  
      const response = await fetch(`${BASE_URL}/api/users/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        const result = await response.json();
        // Throw the actual validation error message
        throw new Error(JSON.stringify(result));
    }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error update users:', error);
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

export const fetchManagers = async ({token}) => {
  const session = await getSession()
    try {
      const response = await fetch(`${BASE_URL}/api/manager/manager`, {
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

  export const userDetailId = async ({id}) => {
    const session = await getSession()
      try {
        const response = await fetch(`${BASE_URL}/api/users/${id}`, {
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

