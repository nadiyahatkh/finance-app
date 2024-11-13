import { format } from "date-fns";
import { getSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const fetchSubmissionUser = async ({token, search, type, finish_status}) => {
    const session = await getSession()
    const statusParams = finish_status?.map(s => `finish_status=${s}`).join('&');
    const typeParams = Array.isArray(type) 
    ? type.map(t => `type=${t}`).join('&') 
    : `type=${type || ''}`;

      try {
        const response = await fetch(`${BASE_URL}/api/submission/index?search=${search}&${typeParams}&${statusParams}`, {
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


export const fetchSubmissionUserDetail = async ({token, id}) => {
    const session = await getSession()
      try {
        const response = await fetch(`${BASE_URL}/api/submission/detail/${id}`, {
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

    export const createSubmissionUser = async ({ data, file }) => {
      const session = await getSession()
      try {
        const formData = new FormData();
        formData.append('due_date', format(data.due_date, 'yyyy-MM-dd'));
        formData.append('type', data.type);
        formData.append('purpose', data.purpose);
        formData.append('bank_account_id', data.bank_account_id);

        data.submission_item.forEach((item, index) => {
          formData.append(`submission_item[${index}][description]`, item.description);
          formData.append(`submission_item[${index}][quantity]`, item.quantity);
          formData.append(`submission_item[${index}][price]`, item.price);
        });
    
        if (file && file.length > 0) {
          file.forEach((file) => {
          formData.append('file[]', file);
        });
      }
    
        const response = await fetch(`${BASE_URL}/api/submission/submissions`, {
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
        console.log('Error creating applicant:', error);
        throw error;
      }
    };

    export const updateSubmissionUser = async ({ data, file, id }) => {
      const session = await getSession()
      try {
        const formData = new FormData();
        formData.append('due_date', format(data.due_date, 'yyyy-MM-dd'));
        formData.append('type', data.type);
        formData.append('purpose', data.purpose);
        formData.append('bank_account_id', data.bank_account_id);

        data.submission_item.forEach((item, index) => {
          formData.append(`submission_item[${index}][description]`, item.description);
          formData.append(`submission_item[${index}][quantity]`, item.quantity);
          formData.append(`submission_item[${index}][price]`, item.price);
        });
    
        if (file && file.length > 0) {
          file.forEach((file) => {
          formData.append('file[]', file);
        });
      }
    
        const response = await fetch(`${BASE_URL}/api/submission/update/${id}`, {
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
        console.log('Error creating applicant:', error);
        throw error;
      }
    };

    export const fetchBankDetail = async ({token, id}) => {
      const session = await getSession()
        try {
          const response = await fetch(`${BASE_URL}/api/submission/bank-account-detail/${id}`, {
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

    export const submissionDetailId = async ({id}) => {
      const session = await getSession()
        try {
          const response = await fetch(`${BASE_URL}/api/submission/detail/${id}`, {
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

      export const updateProfile = async ({ data, token }) => {
        try {
          const formData = new FormData();
          formData.append('username', data.username);
          formData.append('email', data.email);
          // Hanya tambahkan password jika ada nilainya
          if (data.password) {
              formData.append('password', data.password);
          }

          // Hanya tambahkan password_confirmation jika ada nilainya
          if (data.password_confirmation) {
              formData.append('password_confirmation', data.password_confirmation);
          }
          if (data.foto) {
            formData.append('foto', data.foto);
        }
      
          
          const response = await fetch(`${BASE_URL}/api/update`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
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