import { getIDByName } from "enmity/api/assets"
import { Modal, Text, View } from "enmity/components"
import { Plugin, registerPlugin } from "enmity/managers/plugins"
import { getByProps } from "enmity/metro"
import { React } from "enmity/metro/common"
import { create } from "enmity/patcher"

const Patcher = create("SelectTextPlugin")
const Opener = getByProps("openLazy")

const SelectTextPlugin: Plugin = {
    name: "SelectTextPlugin",
    description: "Adds an message action sheet option for selecting text",
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
                    const button = (
                        <ButtonRow
                            key="69"
                            onPressRow={(_) => {
                                Opener.hideActionSheet()
                                Opener.openLazy(
                                        <View>
                                        <View>
                                            <Text>Hello World!</Text>
                                        </View>
                                    </View>,
                                    "SelectTextModal",
                                    {},
                                )
                            }}
                            message="Select Text"
                            iconSource={getIDByName("ic_all_24px")}
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