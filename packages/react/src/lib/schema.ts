import { Schema as S } from "@triplit/client"

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
                        enabled: S.Optional(S.Boolean({ default: true })),
                        defaultLocale: S.Optional(S.String()),
                        locales: S.Optional(S.Json())
                    })
                ),
                autoText: S.Optional(
                    S.Record({
                        enabled: S.Optional(S.Boolean({ default: true }))
                    })
                ),
                autoImage: S.Optional(
                    S.Record({
                        enabled: S.Optional(S.Boolean({ default: true }))
                    })
                ),
                autoSound: S.Optional(
                    S.Record({
                        enabled: S.Optional(S.Boolean({ default: true }))
                    })
                ),
                updatedAt: S.Date({ default: S.Default.now() })
            }),
            archived: S.Boolean({ default: false }),
            createdAt: S.Date({ default: S.Default.now() }),
            updatedAt: S.Date({ default: S.Default.now() })
        })
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
        }
    }
})
