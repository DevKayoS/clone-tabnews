export default function status(request, response) {
    response.status(200).json({
        status: true,
        code: 200,
        msg: "tudo certinho"
    })
}


