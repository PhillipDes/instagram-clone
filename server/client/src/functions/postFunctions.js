const likePost = (id, isLiking, setIsLiking, data, setData) => {
    if(isLiking)
        return

    setIsLiking(true)

    fetch('/like', {
        method: 'put', 
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        body: JSON.stringify({
            postId: id 
        })
    }).then(res => res.json())
    .then(result => {
        updateData(result, data, setData, result)
        setIsLiking(false)
    }).catch(error => console.log(error))
}

const unlikePost = (id, isLiking, setIsLiking, data, setData) => {
    if(isLiking)
        return

    setIsLiking(true)

    fetch('/unlike', {
        method: 'put', 
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        body: JSON.stringify({
            postId: id
        })
    }).then(res => res.json())
    .then(result => {
        updateData(result, data, setData)
        setIsLiking(false)
    }).catch(error => console.log(error))
}

const makeComment = (text, postId, data, setData) => {
    fetch('/comment', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        },
        body: JSON.stringify({
            postId,
            text
        })
    }).then(res => res.json())
    .then(result => {
        console.log(result)
        updateData(result, data, setData)
    }).catch(error => {
        console.log(error)
    })
}

const deletePost = (postId, data, setData) => {
    fetch(`/deletepost/${postId}`, {
        method: 'delete',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')   
        }
       
    }).then(res => res.json())
    .then(result => {
        console.log(result)
        const newData = data.filter(item => {
            return item._id !== result._id
        })
        setData(newData)
    })
}

const deleteComment = (postId, commentId, data, setData) => {
    fetch(`/deletecomment/${postId}/${commentId}`, {
        method: 'put',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')   
        }
    }).then(res => res.json())
    .then(result => {
        console.log(result)
        updateData(result, data, setData)
    })
}

const updateData = (result, data, setData) => {
    const newData = data.map(item => {
        if(item._id === result._id) {
            return result
        } else {
            return item
        } 
    })
    setData(newData)
}

export {likePost, unlikePost, makeComment, deletePost, deleteComment}