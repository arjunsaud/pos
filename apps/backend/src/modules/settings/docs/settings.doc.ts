import { applyDecorators } from '@nestjs/common';

import { Doc, DocAuth } from 'src/common/doc/decorators/doc.decorator';

export function SettingsGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get detail an user',
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function SettingsUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: 'settings.update',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
  );
}

export function SettingsUpdateMaintenanceModeDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: 'settings.update.maintenanceMode',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
  );
}

export function SettingsUpdatePagesDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: 'settings.update.pages',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
  );
}

export function SettingsGetMaintenanceModeDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get maintenance mode',
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function SettingsGetPrivacyPolicyDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get privacy policy',
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function SettingsGetTermsAndConditionsDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get terms and conditions',
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function SettingsGetAboutUsDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get about us page settings',
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function SettingsGetOurStoryDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get our story page settings',
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function SettingsGetOurTeamDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get our team page settings',
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}

export function SettingsGetWhyChooseUsDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      summary: 'get why choose us page settings',
    }),
    DocAuth({
      apiKey: true,
      jwtAccessToken: true,
    }),
  );
}
