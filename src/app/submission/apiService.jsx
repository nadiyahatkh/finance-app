import { getSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const fetchSubmission = async ({token, search, type, status, due_date, page, per_page}) => {
  const session = await getSession()
  const statusParams = status.map(s => `status[]=${s}`).join('&');
    const typeParams = type.map(t => `type[]=${t}`).join('&');
    const dateParam = due_date ? `due_date=${due_date}` : '';
    try {
      const response = await fetch(`${BASE_URL}/api/dataApplicant/index?search=${search}&${dateParam}&${typeParams}&${statusParams}&page=${page}&per_page=${per_page}`, {
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

  export const fetchSubmissionDetail = async ({token, id}) => {
    const session = await getSession()
      try {
        const response = await fetch(`${BASE_URL}/api/dataApplicant/detail/${id}`, {
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

    export const approvedSubmission = async ({ id, token }) => {
      try{
        const response = await fetch(`${BASE_URL}/api/dataApplicant/approve/${id}`, {
          method: 'POST',
          headers: {
            "ngrok-skip-browser-warning": true,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', // Tambahkan Content-Type jika diperlukan
          },
        });
      
        if (!response.ok) {
            const result = await response.text();
            throw new Error(result);
          }
      
          const result = await response.json();
          return result;
        } catch (error) {
          console.error('Error update users:', error);
          throw error;
        }
      };

      export const deniedSubmission = async ({ id, token, notes }) => {
        try{
        const formData = new FormData();
        formData.append('notes', notes);
        const response = await fetch(`${BASE_URL}/api/dataApplicant/denied/${id}`, {
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
        console.error('Error update users:', error);
        throw error;
      }
      };

      export const approvedAllSubmission = async ({ token }) => {
        try{
          const response = await fetch(`${BASE_URL}/api/dataApplicant/approveall`, {
            method: 'POST',
            headers: {
              "ngrok-skip-browser-warning": true,
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json', // Tambahkan Content-Type jika diperlukan
            },
          });
        
          if (!response.ok) {
            const result = await response.text();
            throw new Error(result);
          }
        
            const result = await response.json();
            return result;
          } catch (error) {
            console.error('Error update users:', error);
            throw error;
          }
        };

        export const deniedAllSubmission = async ({ token, notes }) => {
          try{
          const formData = new FormData();
          formData.append('notes', notes);
          const response = await fetch(`${BASE_URL}/api/dataApplicant/deniedall`, {
            method: 'POST',
            headers: {
              "ngrok-skip-browser-warning": true,
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
          console.error('Error update users:', error);
          throw error;
        }
        };