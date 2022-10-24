import { getIDByName } from "enmity/api/assets"
import { Form, Modal, Text, View, FormText, Alert } from "enmity/components"
import { Plugin, registerPlugin } from "enmity/managers/plugins"
import { getByProps } from "enmity/metro"
import { React } from "enmity/metro/common"
import { create } from "enmity/patcher"

const Patcher = create("SelectTextPlugin")
const Opener = getByProps("openLazy")

const SelectTextPlugin: Plugin = {
    name: "SelectTextPlugin",
    description: "Adds a message action sheet option for selecting text",
    version: "1.0.0",
    authors: [{
        name: "Tiemen",
        id: "152164749868662784",
    }],

    onStart() {
        Patcher.before(Opener, "openLazy", (_, [component, sheet]) => {
            if (sheet !== "MessageLongPressActionSheet") return

            component.then(instance => {
                const func = instance.default
                instance.default = function ({ message, user, channel, canAddNewReactions }, _) {
                    const original = func(...arguments)
                    if (original.props.children.props.children.props.children[1][0].key === "69")
                        return original

                    const ButtonRow = original.props.children.props.children.props.children[1][0].type
                    // const SelectTextSheet = () => (
                    //     <View>
                    //         <View>
                    //             <Text>{message.content}</Text>
                    //         </View>
                    //     </View>
                    // )
                    const SelectTextSheet = () => {
                        Alert.prompt("Select Text", "can't set default value ;(")
                    }
                    const button = (
                        <ButtonRow
                            key="69"
                            message="Select Text"
                            iconSource={getIDByName("ic_all_24px")}
                            onPressRow={(_) => {
                                Opener.hideActionSheet()
                                Opener.openLazy(
                                    Promise.resolve().then(() => SelectTextSheet()),
                                    "SelectTextModal",
                                    undefined,
                                )
                            }}
                        />
                    )
                    original.props.children.props.children.props.children[1].unshift(button)

                    return original
                }
                return instance
            })
        })
    },

    onStop() {
        Patcher.unpatchAll()
    },
}

registerPlugin(SelectTextPlugin)