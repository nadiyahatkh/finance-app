import { format } from "date-fns";
import { getSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const fetchSubmissionUser = async ({token, search, type, finish_status, page, per_page, due_date}) => {
    const session = await getSession()
    const statusParams = finish_status?.map(s => `finish_status[]=${s}`).join('&');
    const typeParams = type?.map(t => `type[]=${t}`).join('&');
    const dateParam = due_date ? `due_date=${due_date}` : '';

      try {
        const response = await fetch(`${BASE_URL}/api/submission/index?search=${search}&${dateParam}&${typeParams}&${statusParams}&page=${page}&per_page=${per_page}`, {
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
        formData.append('bank_name', data.bank_name);
        formData.append('account_name', data.account_name);
        formData.append('account_number', data.account_number);

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
          const result = await response.text();
          throw new Error(result);
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

        if (data.delete_images && data.delete_images.length > 0) {
          data.delete_images.forEach((file) => {
          formData.append('delete_files[]', file);
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
          const result = await response.text();
          throw new Error(result);
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

      export const updateProfileUser = async ({ data }) => {
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
      
          
          const response = await fetch(`${BASE_URL}/api/submission/update/profiles/user`, {
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

      export const fetchProfileUserId = async () => {
        const session = await getSession()
        try {
          const response = await fetch(`${BASE_URL}/api/submission/profile`, {
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