const handleError = (response) => {
	if (!response.ok) {
		switch (response.status) {
			case 401:
				throw new Error('שם משתמש או סיסמה שגויים');
			case 409:
				throw new Error('הערך תפוס');
			case 500:
				throw new Error('שגיאה בשרת, נסה שנית');
			default:
				throw new Error('שגיאה כללית, נסה שנית');
		}
	}
};

export { handleError };