import { or, Schema as S } from "@triplit/client"

const isUid = ["userId", "=", "$token.sub"] as const
const isOrganizationMember = [
    "organization.members.userId",
    "=",
    "$token.sub"
] as const
const hasApplicationAccess = or([
    ["application.userId", "=", "$token.sub"],
    ["application.organization.members.userId", "=", "$token.sub"]
])

export const schema = S.Collections({
    applications: {
        schema: S.Schema({
            id: S.Id(),
            name: S.String(),
            image: S.Optional(S.String()),
            url: S.Optional(S.String()),
            userId: S.Optional(S.String()),
            organizationId: S.Optional(S.String()),
            config: S.Record({
                autoTranslate: S.Optional(
                    S.Record({
                        enabled: S.Optional(S.Boolean()),
                        defaultLocale: S.Optional(S.String()),
                        locales: S.Optional(S.Json())
                    })
                ),
                autoText: S.Optional(
                    S.Record({
                        enabled: S.Optional(S.Boolean())
                    })
                ),
                autoImage: S.Optional(
                    S.Record({
                        enabled: S.Optional(S.Boolean())
                    })
                ),
                autoSound: S.Optional(
                    S.Record({
                        enabled: S.Optional(S.Boolean())
                    })
                ),
                updatedAt: S.Date({ default: S.Default.now() })
            }),
            archived: S.Boolean({ default: false }),
            createdAt: S.Date({ default: S.Default.now() }),
            updatedAt: S.Date({ default: S.Default.now() })
        }),
        permissions: {
            authenticated: {
                read: {
                    filter: [
                        or([
                            isUid,
                            isOrganizationMember,
                            ["id", "=", "$token.sub"]
                        ])
                    ]
                },
                insert: {
                    filter: [or([isUid, isOrganizationMember])]
                },
                update: {
                    filter: [or([isUid, isOrganizationMember])]
                },
                postUpdate: {
                    filter: [
                        or([isUid, isOrganizationMember]),
                        ["updatedAt", ">", "$prev.createdAt"]
                    ]
                },
                delete: {
                    filter: [or([isUid, isOrganizationMember])]
                }
            }
        }
    },
    translations: {
        schema: S.Schema({
            id: S.Id(),
            key: S.String(),
            message: S.String(),
            context: S.Optional(S.String()),
            locale: S.String(),
            href: S.Optional(S.String()),
            dynamic: S.Optional(S.Boolean()),
            applicationId: S.String(),
            createdAt: S.Date({ default: S.Default.now() }),
            updatedAt: S.Date({ default: S.Default.now() })
        }),
        relationships: {
            application: S.RelationById("applications", "$applicationId"),
            from: S.RelationOne("translations", {
                where: [
                    ["key", "=", "$key"],
                    ["locale", "!=", "$locale"],
                    [
                        "locale",
                        "=",
                        "$application.config.autoTranslate.defaultLocale"
                    ]
                ]
            })
        },
        permissions: {
            authenticated: {
                read: {
                    filter: [hasApplicationAccess]
                },
                insert: {
                    filter: [hasApplicationAccess]
                },
                update: {
                    filter: [hasApplicationAccess]
                },
                postUpdate: {
                    filter: [
                        hasApplicationAccess,
                        ["updatedAt", ">", "$prev.createdAt"]
                    ]
                },
                delete: {
                    filter: [hasApplicationAccess]
                }
            }
        }
    }
})
