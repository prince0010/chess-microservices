import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';

@Injectable()
export class AppVersionService {
  // changeMe!
  private readonly minimumRequiredVersion = '1.0.0'; // hard update
  private readonly latestVersion = '1.0.0'; // soft update available

  checkVersion(currentVersion: string) {
    const versionStatus = this.compareVersions(
      currentVersion,
      this.minimumRequiredVersion,
    );
    const softUpdateStatus = this.compareVersions(
      currentVersion,
      this.latestVersion,
    );

    return {
      currentVersion,
      minimumRequiredVersion: this.minimumRequiredVersion,
      latestVersion: this.latestVersion,
      requiresUpdate: versionStatus < 0,
      recommendedUpdate: softUpdateStatus < 0,
      isCriticalUpdate: versionStatus < 0,
      message:
        versionStatus < 0
          ? 'criticalUpdate'
          : softUpdateStatus < 0
            ? 'newUpdateAvailable'
            : 'appUpToDate',
      storeUrls: {
        // changeMe! when apple approve app and update env variable for ios
        ios: envs.iosDownloadAppUrl,
        android: envs.androidDownloadAppUrl,
      },
    };
  }

  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    const maxLen = Math.max(parts1.length, parts2.length);

    for (let i = 0; i < maxLen; i++) {
      const a = parts1[i] ?? 0;
      const b = parts2[i] ?? 0;
      if (a > b) return 1;
      if (a < b) return -1;
    }
    return 0;
  }
}
