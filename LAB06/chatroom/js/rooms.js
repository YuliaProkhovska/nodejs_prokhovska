const private_rooms = []


const getPrivateRooms = () => {
    return private_rooms;
}

const isRoomPrivate = (room) => {
    room = room.trim().toLowerCase()
    if (inArray(private_rooms, room))
        return true;

    return false;
}

const setRoomPrivate = (state, room) => {
    room = room.trim().toLowerCase()

    if(state === true)
        removeFromArr(private_rooms, room)
    else
    if(!inArray(private_rooms, room))
        private_rooms.push(room);
}

function inArray(array, item)
{
    let index = array.indexOf(item);
    if (index !== -1)
        return true
    return false;
}
function removeFromArr(array, item)
{
    let index = array.indexOf(item);
    if (index !== -1) {
        array.splice(index, 1);
    }
}

module.exports = {
    getPrivateRooms,
    isRoomPrivate,
    setRoomPrivate
}
