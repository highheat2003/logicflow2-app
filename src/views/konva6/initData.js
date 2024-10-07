

export default function initData(background) {
    const data = `
    {
        "attrs": {
            "width": 1303,
            "height": 937,
            "draggable": true,
            "x": 131,
            "y": 9
        },
        "className": "Stage",
        "children": [{
                "attrs": {},
                "className": "Layer",
                "children": [{
                        "attrs": {
                            "src": "${background}"
                        },
                        "className": "Image"
                    }, {
                        "attrs": {
                            "x": 513,
                            "y": 84.3125
                        },
                        "className": "Transformer"
                    }
                ]
            }
        ]
    }`
    return JSON.parse(data)
}