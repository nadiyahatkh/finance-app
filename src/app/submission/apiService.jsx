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

    export const approvedSubmission = async ({ id, token, file }) => {
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

      export const approvedAllSubmission = async ({ selected_ids, token }) => {
        try{
          const response = await fetch(`${BASE_URL}/api/dataApplicant/approveall`, {
            method: 'POST',
            headers: {
              "ngrok-skip-browser-warning": true,
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json', // Tambahkan Content-Type jika diperlukan
            },
            body: JSON.stringify({ selected_ids }),
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

        export const deniedAllSubmission = async ({ token, notes, selected_ids }) => {
          try{
          const formData = new FormData();
          formData.append('notes', notes);
          formData.append('selected_ids[]', selected_ids);

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

        export const checkBoxFinance = async ({token, id}) => {
          const session = await getSession()
            try {
              const response = await fetch(`${BASE_URL}/api/dataApplicant/admin-approvals/${id}/check`, {
                method: 'POST',
                headers: {
                  "ngrok-skip-browser-warning": true,
                  'Authorization': `Bearer ${session.user.token}`,
                },
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

        export const proofImage = async ({token, id, file}) => {
          const session = await getSession()
            try {
              const formData = new FormData()
              if (file && file.length > 0) {
                file.forEach((file) => {
                formData.append('file[]', file);
              });
              }

              const response = await fetch(`${BASE_URL}/api/dataApplicant/proof/${id}`, {
                method: 'POST',
                headers: {
                  "ngrok-skip-browser-warning": true,
                  'Authorization': `Bearer ${session.user.token}`,
                },
                body: formData,
              })
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

          export const selectDeniedApplicant = async ({ ids, token }) => {
            try {
              const formData = FormData();
              
              const response = await fetch(`${BASE_URL}/api/dataApplicant/approveall`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ids }),
              });
              if (!response.ok) {
                throw new Error('Failed to remove item Applicant');
              }
              return await response.json();
            } catch (error) {
              console.error('Error removing item Applicant:', error);
            }
          };
      