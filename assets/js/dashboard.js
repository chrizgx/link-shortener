const del = async (id) => {
    const response = await fetch(`/app/delete-link`, {
        method: "POST",
        body: JSON.stringify({
            id: id
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    });
    window.location.reload();
}