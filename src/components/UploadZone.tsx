'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useIGStore } from '@/lib/store';
import { FILE_MAPPING } from '@/constants/fileMapping';
import {
  parseCategories,
  parseTopics,
  parseAdvertisers,
} from '@/lib/parsers/ads-profiling';
import {
  parseLoginActivity,
  parseLinkHistory,
} from '@/lib/parsers/digital-footprint';
import { parseFollowers, parseFollowing, analyzeSocialRelationship } from '@/lib/parsers/social';
import type {
  MetaCategoryJSON,
  TopicsJSON,
  AdvertiserJSON,
  LoginActivityJSON,
  LinkHistoryJSON,
  FollowersJSON,
  FollowingJSON,
} from '@/types';

type FileStatus = 'success' | 'error' | 'pending';

interface UploadedFile {
  name: string;
  type: string;
  status: FileStatus;
  message: string;
}

export function UploadZone() {
  const store = useIGStore();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      const fileName = file.name.toLowerCase();
      let fileType = 'Unknown';
      let status: FileStatus = 'error';
      let message = 'File tidak dikenal';

      try {
        const text = await file.text();
        const json = JSON.parse(text);

        // ─────────────────────────────────────────────────────
        // ADS PROFILING
        // ─────────────────────────────────────────────────────
        if (fileName.includes('other_categories')) {
          fileType = 'Meta Categories';
          const data = parseCategories(json as MetaCategoryJSON);
          store.setCategories(data);
          status = 'success';
          message = `✓ ${data.length} label dimuat`;
        } else if (fileName.includes('recommended_topics')) {
          fileType = 'Recommended Topics';
          const data = parseTopics(json as TopicsJSON);
          store.setTopics(data);
          status = 'success';
          message = `✓ ${data.length} topik dimuat`;
        } else if (fileName.includes('advertisers_using')) {
          fileType = 'Advertisers';
          const data = parseAdvertisers(json as AdvertiserJSON);
          store.setAdvertisers(data);
          status = 'success';
          message = `✓ ${data.length} pengiklan dimuat`;
        }

        // ─────────────────────────────────────────────────────
        // DIGITAL FOOTPRINT
        // ─────────────────────────────────────────────────────
        else if (fileName.includes('login_activity')) {
          fileType = 'Login Activity';
          const data = parseLoginActivity(json as LoginActivityJSON);
          store.setLoginActivity(data);
          status = 'success';
          message = `✓ ${data.length} login dimuat`;
        } else if (fileName.includes('link_history')) {
          fileType = 'Link History';
          const data = parseLinkHistory(json as LinkHistoryJSON[]);
          store.setLinkHistory(data);
          status = 'success';
          message = `✓ ${data.length} link dimuat`;
        }

        // ─────────────────────────────────────────────────────
        // SOCIAL AUDIT
        // ─────────────────────────────────────────────────────
        else if (fileName.includes('followers')) {
          fileType = 'Followers';
          const data = parseFollowers(json as FollowersJSON);
          store.setFollowers(data);
          // Re-analyze if following already exists
          if (store.following.length > 0) {
            store.setSocialAnalysis(analyzeSocialRelationship(data, store.following));
          }
          status = 'success';
          message = `✓ ${data.length} follower dimuat`;
        } else if (
          fileName.includes('following') &&
          !fileName.includes('followers')
        ) {
          fileType = 'Following';
          const data = parseFollowing(json as FollowingJSON);
          store.setFollowing(data);
          // Re-analyze if followers already exist
          if (store.followers.length > 0) {
            store.setSocialAnalysis(analyzeSocialRelationship(store.followers, data));
          }
          status = 'success';
          message = `✓ ${data.length} following dimuat`;
        } else {
          fileType = 'Unknown File';
          status = 'error';
          message = '✗ Format file tidak dikenali';
        }
      } catch (error) {
        fileType = 'Parse Error';
        status = 'error';
        message =
          error instanceof SyntaxError
            ? '✗ File JSON tidak valid'
            : '✗ Error membaca file';
      }

      setUploadedFiles((prev) => [
        ...prev,
        {
          name: file.name,
          type: fileType,
          status,
          message,
        },
      ]);
    },
    [store]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsProcessing(true);
      setUploadedFiles([]);

      await Promise.all(acceptedFiles.map(processFile));

      setIsProcessing(false);
    },
    [processFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
    },
    disabled: isProcessing,
  });

  const successCount = uploadedFiles.filter((f) => f.status === 'success')
    .length;
  const errorCount = uploadedFiles.filter((f) => f.status === 'error').length;

  return (
    <div className="w-full space-y-6">
      {/* ─────────────────────────────────────────────────────
          QUICK REFERENCE CARDS
          ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FileGuideCard
          title="📢 Ads Profiling"
          files={FILE_MAPPING.PROFILING}
        />
        <FileGuideCard
          title="👣 Digital Footprint"
          files={FILE_MAPPING.FOOTPRINT}
        />
        <FileGuideCard title="👥 Social Audit" files={FILE_MAPPING.SOCIAL} />
      </div>

      {/* ─────────────────────────────────────────────────────
          DROPZONE
          ───────────────────────────────────────────────────── */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragActive
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="space-y-3">
          <div className="text-4xl">📁</div>
          <div>
            <p className="text-lg font-semibold text-zinc-100">
              {isDragActive
                ? 'Drop file di sini'
                : 'Drag & drop file JSON di sini'}
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              atau klik untuk memilih file
            </p>
          </div>
          <p className="text-xs text-zinc-600 mt-4">
            Upload semua file dari folder masing-masing modul (lihat kartu
            referensi di atas)
          </p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────
          STATUS SUMMARY
          ───────────────────────────────────────────────────── */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex gap-4 text-sm">
            {successCount > 0 && (
              <div className="px-4 py-2 bg-green-500/10 text-green-500 rounded-lg font-medium border border-green-500/20">
                ✓ {successCount} file berhasil
              </div>
            )}
            {errorCount > 0 && (
              <div className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg font-medium border border-red-500/20">
                ✗ {errorCount} file gagal
              </div>
            )}
          </div>

          <div className="space-y-2">
            {uploadedFiles.map((file, idx) => (
              <div
                key={idx}
                className={`
                  p-4 rounded-lg border
                  ${
                    file.status === 'success'
                      ? 'bg-green-500/5 border-green-500/20'
                      : 'bg-red-500/5 border-red-500/20'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={file.status === 'success' ? 'text-green-500' : 'text-red-500'}>
                        {file.status === 'success' ? '✓' : '✗'}
                      </span>
                      <div>
                        <p className="font-medium text-zinc-100 text-sm">
                          {file.type}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">
                          {file.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`
                      text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap ml-2
                      ${
                        file.status === 'success'
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                          : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }
                    `}
                  >
                    {file.status === 'success' ? 'Loaded' : 'Failed'}
                  </div>
                </div>

                <p className="text-xs text-zinc-400 mt-2">
                  {file.message}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setUploadedFiles([])}
              disabled={isProcessing}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg
                bg-zinc-800 text-zinc-100 hover:bg-zinc-700
                transition-colors
                ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              Clear Status
            </button>

            {successCount > 0 && (
              <button
                onClick={() => {
                  store.reset();
                  setUploadedFiles([]);
                }}
                disabled={isProcessing}
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg
                  bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20
                  transition-colors
                  ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                Reset All Data
              </button>
            )}
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="mt-6 flex items-center justify-center gap-2 text-zinc-500">
          <div className="w-4 h-4 border-2 border-zinc-700 border-t-zinc-300 rounded-full animate-spin" />
          <span className="text-sm">Processing files...</span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FILE GUIDE CARD COMPONENT
// ─────────────────────────────────────────────────────────────

interface FileGuideCardProps {
  title: string;
  files: (typeof FILE_MAPPING.PROFILING)[0][];
}

function FileGuideCard({ title, files }: FileGuideCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <h3 className="font-bold text-zinc-200 mb-3 text-sm">{title}</h3>
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="bg-zinc-800/50 rounded p-2 text-xs space-y-1"
          >
            <div className="flex items-center gap-2">
              <span>{file.icon}</span>
              <p className="font-medium text-zinc-300">{file.name}</p>
            </div>
            <p className="text-zinc-500 text-[10px] leading-tight">
              📍 {file.hint}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
